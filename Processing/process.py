def main():

    dictionary = {}
    common = []

    with open('Processing/wordle-nyt-words-14855.txt', 'r') as dict:
        for line in dict:
            dictionary[line.strip().lower()] = True

    with open('Processing/4000words.txt', 'r') as fourk:
        for line in fourk:
            word = line.strip().lower()
            if dictionary.get(word, False):
                common.append(word)

    with open('Processing/answers.txt', 'w') as answers:
        for w in common:
            answers.write(w + '\n')

if __name__ == "__main__":
    main()
