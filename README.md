# google-imageannotations

https://google-imageannotations.vercel.app/

## エンドポイント
|      |   メソッド   | URI |
| :---: | :--------: | :-------: |
| 画像のアップロード    | POST | /api/upload |

## 出力
[Cloud Vision APIリファレンス](https://cloud.google.com/php/docs/reference/cloud-vision/latest/V1.WebDetection?hl=en)を参照

|  名前  |   説明   |
| :---: | :---: |
| `web_entities`    | 画像に含まれる要素とスコア |
|`full_matching_images`|完全一致画像|
|`partial_matching_images`|部分一致画像|
|`pages_with_matching_images`|画像が一致するページ|
|`visually_similar_images`|類似画像|
|`best_guess_labels`|最良の推測ラベル|
