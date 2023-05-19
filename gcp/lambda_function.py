import boto3
import json
from google.cloud import vision

def lambda_handler(event, context):
    try:
        # S3からのイベント情報を取得
        s3_event = event['Records'][0]['s3']
        bucket_name = s3_event['bucket']['name']
        object_key = s3_event['object']['key']
        
        # Google Cloud Vision APIのクライアントを初期化
        client = vision.ImageAnnotatorClient()
        
        # S3オブジェクトのURLを取得
        s3 = boto3.client('s3')
        object_url = s3.generate_presigned_url(
            ClientMethod='get_object',
            Params={'Bucket': bucket_name, 'Key': object_key}
        )
        
        # 画像をGoogle Cloud Vision APIに渡して結果を取得
        image = vision.Image()
        image.source.image_uri = object_url
        response = client.web_detection(image=image)
        
        # APIレスポンスからWeb検出結果を取得
        annotations = response.web_detection
        
        # 結果を別のS3バケットに保存する
        result_bucket_name = bucket_name + '-after'  # 結果を保存する別のS3バケット名
        result_object_key = object_key + '.json'  # 結果を保存するオブジェクトキー（ファイル名）
        result_data = {
            'web_entities': [
                {
                    'description': entity.description,
                    'score': entity.score
                }
                for entity in annotations.web_entities
            ],
            'full_matching_images': [
                {
                    'url': image.url,
                }
                for image in annotations.full_matching_images
            ],
            'partial_matching_images': [
                {
                    'url': image.url,
                }
                for image in annotations.partial_matching_images
            ],
            'pages_with_matching_images': [
                {
                    'url': page.url,
                }
                for page in annotations.pages_with_matching_images
            ],
            'visually_similar_images': [
                {
                    'url': image.url,
                }
                for image in annotations.visually_similar_images
            ],
            'best_guess_labels': [
                {
                    'label': label.label,
                    'language_code': label.language_code,
                }
                for label in annotations.best_guess_labels
            ],
        }
        s3.put_object(
            Bucket=result_bucket_name,
            Key=result_object_key,
            Body=json.dumps(result_data)
        )
        s3.delete_object(
            Bucket=bucket_name,
            Key=object_key
        )
        
        # Lambda関数のレスポンスを返す
        return {
            'statusCode': 200,
            'body': json.dumps('Web detection completed!')
        }

    except KeyError as e:
        error_message = 'Invalid S3 event format: {}'.format(str(e))
        print(error_message)
        return {
            'statusCode': 400,
            'body': json.dumps(error_message)
        }
        
    except (GoogleAPIError, RetryError) as e:
        error_message = 'Google Cloud Vision API error: {}'.format(str(e))
        print(error_message)
        return {
            'statusCode': 500,
            'body': json.dumps(error_message)
        }
        
    except Exception as e:
        error_message = 'Unexpected error occurred: {}'.format(str(e))
        print(error_message)
        return {
            'statusCode': 500,
            'body': json.dumps(error_message)
        }
