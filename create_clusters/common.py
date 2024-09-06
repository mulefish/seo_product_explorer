# Thanks Stackoverflow!
# https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"

def o2j(list_of_objs):
    j = json.dumps( list_of_objs )
    return j 
def magenta(msg): 
    x = "{}{}{}{}".format(BgMagenta, FgBlack, msg, Reset)
    print(x)

def yellow(msg):
    x = "{}{}{}{}".format(BgYellow, FgBlack, msg, Reset)
    print(x)


def green(msg):
    x = "{}{}{}{}".format(BgGreen, FgBlack, msg, Reset)
    print(x)


def cyan(msg):
    x = "{}{}{}{}".format(BgCyan, FgBlack, msg, Reset)
    print(x)


def log(msg):
    print(msg)

def verdict(a, b, msg):
    if a == b:
        cyan("PASS " + msg )
    else:
        yellow("FAIL " + msg)

def number_to_letter(num):
    x = num
    if num <= 0:
        raise ValueError("Input must be a positive integer.")
    
    letters = ""
    while num > 0:
        num -= 1
        # Map the remainder to the corresponding letter
        letters = chr(num % 26 + ord('A')) + letters  
        # Divide by 26 to move to the next digit
        num //= 26
        
    return letters

def readPsvFile_getSentences(input_file, number_of_lines_to_read):
    """Read a psv and return a obj """

    lookup = {}
    sentences = []
    seen = {} 
    loop = 0 
    with open(input_file, 'r') as file:
        for line in file:
            fields = line.strip().split('|')
            if loop > 0 and loop < number_of_lines_to_read:
                if len(fields[3]) > 3: 
                    description = fields[3]
                    activity = fields[2]
                    if description in seen:
                        seen[description] += 1
                    else:
                        seen[description] = 1
                        sentences.append(description)
                        letter = number_to_letter(len(sentences))
                        obj = {"id":letter, "group":-1, "activity": activity}
                        lookup[description] = obj
            loop += 1
    obj = {
        "lookup":lookup,
        "sentences":sentences
    }        
    return obj