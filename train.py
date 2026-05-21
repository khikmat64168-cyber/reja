########### L-TASK ##############

def reverseSentence(gapp):
  sozlar = gapp.split(" ")
  reversed_sozlar = [word[::-1] for word in sozlar]
  return " ".join(reversed_sozlar)


print(reverseSentence("we like coding!"))
print(reverseSentence("anduril completed the target "))











'''
def countVowels(string):
  count = 0
  for harf in string:
    if harf in "aeioeu":
      count += 1
  return count



print(countVowels("string"))    
print(countVowels("Salom"))    
print(countVowels("Miiiiiiiiit"))    

'''