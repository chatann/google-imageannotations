def count_character_occurrences(compressed_data):
    occurrences = {chr(i): 0 for i in range(ord('a'), ord('z')+1)}
    stack = []
    count = 0
    coeff = 1
    
    for char in compressed_data:
        if char.isdigit():
            count = count * 10 + int(char)
        elif char == '(':
            stack.append(count)
            count = 0
        elif char == ')':
            stack = stack[:-1]
        else:
            if count != 0:
                coeff *= count
                count = 0
            for n in stack:
                coeff *= n
            occurrences[char] += coeff
            coeff = 1
    
    return occurrences

compressed_data = str(input())
occurrences = count_character_occurrences(compressed_data)

for char, count in occurrences.items():
    print(f"{char}: {count}")
