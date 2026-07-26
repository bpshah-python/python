// data.js — Default Lab Exercise dataset.
// These are the built-in exercises shipped with the site.
// Anything added through the Admin panel is stored separately (in the
// visitor's browser, via localStorage) and merged on top of this list
// at render time — see script.js -> getAllPrograms().

const DEFAULT_PROGRAMS = [
  {
    id: "d1",
    num: 1,
    title: 'Print "Hello, World!"',
    description: "Write a Python program to print \"Hello,World!\".",
    category: "Basics",
    code: `print("Hello, World!")`
  },
  {
    id: "d2",
    num: 2,
    title: "Celsius to Fahrenheit",
    description: "Write a Python program to convert a temperature from Celsius to Fahrenheit.",
    category: "Basics",
    code: `celsius = float(input("Enter temperature in Celsius: "))
fahrenheit = (celsius * 9/5) + 32
print(f"{celsius}°C is equal to {fahrenheit}°F")`
  },
  {
    id: "d3",
    num: 3,
    title: "Name and Age with f-strings",
    description: "Write a Python program using f-strings to display a person's name and age.",
    category: "Basics",
    code: `name = "Aarav"
age = 21
print(f"My name is {name} and I am {age} years old.")`
  },
  {
    id: "d4",
    num: 4,
    title: "Uppercase and Lowercase",
    description: "Write a Python program to convert a given string to uppercase and lowercase.",
    category: "Strings",
    code: `text = "Hello Python"
print("Uppercase:", text.upper())
print("Lowercase:", text.lower())`
  },
  {
    id: "d5",
    num: 5,
    title: "Even or Odd",
    description: "Write a Python program to check if a number is even or odd.",
    category: "Conditionals",
    code: `num = int(input("Enter a number: "))
if num % 2 == 0:
    print(f"{num} is even")
else:
    print(f"{num} is odd")`
  },
  {
    id: "d6",
    num: 6,
    title: "Greatest Among n Numbers",
    description: "Write a Python program to find the greatest number among n numbers.",
    category: "Conditionals",
    code: `n = int(input("How many numbers? "))
numbers = []
for i in range(n):
    numbers.append(float(input(f"Enter number {i+1}: ")))

greatest = numbers[0]
for value in numbers:
    if value > greatest:
        greatest = value

print(f"The greatest number is {greatest}")`
  },
  {
    id: "d7",
    num: 7,
    title: "Print 1 to 10 (for loop)",
    description: "Write a Python program to print numbers from 1 to 10 using a for loop.",
    category: "Loops",
    code: `for i in range(1, 11):
    print(i)`
  },
  {
    id: "d8",
    num: 8,
    title: "Even Numbers 1 to 100",
    description: "Write a Python program to print all even numbers from 1 to 100 using a for loop.",
    category: "Loops",
    code: `for i in range(2, 101, 2):
    print(i)`
  },
  {
    id: "d9",
    num: 9,
    title: "Sum of Odd Numbers 1 to 50",
    description: "Write a Python program to print the sum of all odd numbers from 1 to 50 using a while loop.",
    category: "Loops",
    code: `num = 1
total = 0
while num <= 50:
    if num % 2 != 0:
        total += num
    num += 1

print(f"Sum of odd numbers from 1 to 50 is {total}")`
  },
  {
    id: "d10",
    num: 10,
    title: "Multiplication Table",
    description: "Write a Python program to print the multiplication table of a given number.",
    category: "Loops",
    code: `num = int(input("Enter a number: "))
for i in range(1, 11):
    print(f"{num} x {i} = {num * i}")`
  },
  {
    id: "d11",
    num: 11,
    title: "Factorial of a Number",
    description: "Write a Python program to find the factorial of a number.",
    category: "Loops",
    code: `num = int(input("Enter a number: "))
factorial = 1

if num < 0:
    print("Factorial does not exist for negative numbers")
else:
    for i in range(1, num + 1):
        factorial *= i
    print(f"The factorial of {num} is {factorial}")`
  },
  {
    id: "d12",
    num: 12,
    title: "Reverse of a Number",
    description: "Write a Python program to print the reverse of a given number.",
    category: "Numbers",
    code: `num = int(input("Enter a number: "))
reversed_num = 0

n = abs(num)
while n > 0:
    digit = n % 10
    reversed_num = reversed_num * 10 + digit
    n //= 10

if num < 0:
    reversed_num = -reversed_num

print(f"Reversed number: {reversed_num}")`
  },
  {
    id: "d13",
    num: 13,
    title: "Fibonacci Series",
    description: "Write a Python program to print the Fibonacci series.",
    category: "Loops",
    code: `n = int(input("How many terms? "))
a, b = 0, 1

print("Fibonacci Series:")
for _ in range(n):
    print(a, end=" ")
    a, b = b, a + b
print()`
  },
  {
    id: "d14",
    num: 14,
    title: "Armstrong Number",
    description: "Write a Python program to check if a number is an Armstrong number.",
    category: "Numbers",
    code: `num = int(input("Enter a number: "))
digits = str(num)
power = len(digits)

total = sum(int(d) ** power for d in digits)

if total == num:
    print(f"{num} is an Armstrong number")
else:
    print(f"{num} is not an Armstrong number")`
  },
  {
    id: "d15",
    num: 15,
    title: "Sum of Digits",
    description: "Write a Python program to print the sum of the digits of a given number.",
    category: "Numbers",
    code: `num = int(input("Enter a number: "))
total = 0
n = abs(num)

while n > 0:
    total += n % 10
    n //= 10

print(f"Sum of digits: {total}")`
  },
  {
    id: "d16",
    num: 16,
    title: "Sum of List Elements",
    description: "Write a Python program to find the sum of all elements in a list using a for loop.",
    category: "Lists",
    code: `numbers = [12, 5, 8, 21, 34, 3]
total = 0

for value in numbers:
    total += value

print(f"List: {numbers}")
print(f"Sum of elements: {total}")`
  },
  {
    id: "d17",
    num: 17,
    title: "Max and Min in a List",
    description: "Write a Python program to find the maximum and minimum elements in a list.",
    category: "Lists",
    code: `numbers = [12, 5, 8, 21, 34, 3]

maximum = numbers[0]
minimum = numbers[0]

for value in numbers:
    if value > maximum:
        maximum = value
    if value < minimum:
        minimum = value

print(f"List: {numbers}")
print(f"Maximum: {maximum}")
print(f"Minimum: {minimum}")`
  },
  {
    id: "d18",
    num: 18,
    title: "Remove Duplicates from a List",
    description: "Write a Python program to remove duplicates from a list.",
    category: "Lists",
    code: `numbers = [1, 2, 2, 3, 4, 4, 5, 1]
unique_numbers = []

for value in numbers:
    if value not in unique_numbers:
        unique_numbers.append(value)

print(f"Original list: {numbers}")
print(f"List without duplicates: {unique_numbers}")`
  },
  {
    id: "d19",
    num: 19,
    title: "Create and Print a Dictionary",
    description: "Write a Python program to create a dictionary, add key-value pairs, and print the dictionary.",
    category: "Dictionaries",
    code: `student = {}
student["name"] = "Priya"
student["age"] = 20
student["course"] = "Computer Science"

print("Student dictionary:")
print(student)

for key, value in student.items():
    print(f"{key}: {value}")`
  },
  {
    id: "d20",
    num: 20,
    title: "Reverse a String",
    description: "Write a Python program to reverse a string.",
    category: "Strings",
    code: `text = "Python"
reversed_text = text[::-1]
print(f"Original: {text}")
print(f"Reversed: {reversed_text}")`
  },
  {
    id: "d21",
    num: 21,
    title: "Count Vowels in a String",
    description: "Write a Python program to count the number of vowels in a string.",
    category: "Strings",
    code: `text = input("Enter a string: ")
vowels = "aeiouAEIOU"
count = 0

for char in text:
    if char in vowels:
        count += 1

print(f"Number of vowels: {count}")`
  },
  {
    id: "d22",
    num: 22,
    title: "Length of a String",
    description: "Write a Python program to find the length of a string.",
    category: "Strings",
    code: `text = input("Enter a string: ")
print(f"Length of the string: {len(text)}")`
  },
  {
    id: "d23",
    num: 23,
    title: "Check Palindrome",
    description: "Write a Python program to check if a string is a palindrome.",
    category: "Strings",
    code: `text = input("Enter a string: ")
cleaned = text.replace(" ", "").lower()

if cleaned == cleaned[::-1]:
    print(f'"{text}" is a palindrome')
else:
    print(f'"{text}" is not a palindrome')`
  },
  {
    "id": "cms1madiv24waw",
    "num": 24,
    "title": "Check if a number is positive, negative or neutral",
    "description": "Write a Python program to input a number and check if the number is positive, negative or neutral.",
    "code": "n = float(input(\"Enter a number: \"))\nif n<0:\n    print(f\"{n} is a negative number\")\nelif n>0:\n    print(f\"{n} is a positive number\")\nelse:\n    print(f\"{n} is a neutral number\")",
    "category": "Conditionals"
  }
];
