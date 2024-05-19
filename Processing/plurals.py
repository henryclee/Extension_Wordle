def main():

    dictionary = {}
    plurals = {}

    with open('Processing/answers.txt', 'r') as dict:
        for line in dict:
            dictionary[line.strip().lower()] = True

    with open('Processing/plurals.txt', 'w') as plurals:
        for word in dictionary.keys():
            if word[-1] == "s" and word[-2] != "s":
                plurals.write(word + '\n')

if __name__ == "__main__":
    main()
