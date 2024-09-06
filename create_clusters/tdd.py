from common import verdict, number_to_letter, readPsvFile_getSentences

def number_to_letter_test(x_of_y): 
    actual = {    
        "a": number_to_letter(1),
        "z":number_to_letter(26),
        "aa": number_to_letter(27)
    }
    expected = {'a': 'A', 'z': 'Z', 'aa': 'AA'}
    verdict(actual,expected, "{} number_to_letter".format(x_of_y))

def readPsvFile_getSentences_test(x_of_y): 
    number_to_find = 3
    found = 0 
    x = readPsvFile_getSentences("data.psv", number_to_find)
    lookup  = x["lookup"]
    sentences = x["sentences"]    

    for sentence in sentences: 
        if sentence in lookup:
            found += 1 
    found += 1 # Because zero based
    verdict(number_to_find,found, "{} readPsvFile_getSentences_test found {} ".format(x_of_y, found))

number_to_letter_test("1 of 3") 
readPsvFile_getSentences_test("2 of 3") 



