def countVowels(string):
  count = 0
  for harf in string:
    if harf in "aeioeu":
      count += 1
  return count



print(countVowels("string"))    
print(countVowels("Salom"))    
print(countVowels("Miiiiiiiiit"))    