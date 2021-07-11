require "pry-byebug"

binding.pry

puts("Hello World!")
puts "Hello this way as well"

x = 3
y = 4
z = 5
answer = x*y + z
puts("The Answer is:")
puts(answer)

greeting = "Hello, "
person1 = "Joe"
person2 = "Bob"

fullMessage1 = greeting + person1
puts(fullMessage1)

fullMessage2 = greeting + person2
puts(fullMessage2)

def sayHello(person)
  intro = "Hello, "
  fullMessage = intro + person
  puts(fullMessage)
end

person3 = "Alice"
sayHello(person3)
sayHello("Carol")

def introduce(greeter, greeted)
  message = "Hello, " + greeted + ", I am " + greeter
  if (greeter == greeted)
    message = "Hello, " + greeted + ", we have the same name"
  end
  puts(message)
end

introduce(person1, person3)
introduce(person2, "Bob")

def addExcitement(message, level)
  if (level == 0)
    message = message + "..."
  end
  i = 0
  while (i < level)
    message = message + "!"
    i = i + 1
  end
  message
end

puts(addExcitement("I like turtles", 0))
puts(addExcitement("I like turtles", 2))
puts(addExcitement("I like turtles", 4))

def sayGoodbye(person)
  intro = "Goodbye, "
  goodbye = addExcitement(intro + person, 3)
  postscript = " I hope to see you soon"
  fullMessage = goodbye + postscript
  puts(fullMessage)
end

sayGoodbye(person1)
sayGoodbye(person2)
sayGoodbye(person3)

### data types

# array

a1 = [1, 2, 3]
a2 = [4, 5, 6]
v1 = a1.first
v2 = a2[2]
a3 = a2.take(2).push(v1).push(v2)
puts("Start array print:")
puts(a3)
puts("End array print")

# hash

h1 = {
  "Chicago" => "Illinois",
  "San Francisco" => "California",
  "Seattle" => "Washington",
}
c1 = h1["Chicago"]
hasCity1 = h1.include?("Seattle")
hasCity2 = h1.include?("Los Angeles")
cities = h1.keys
h1.delete("San Francisco")
puts(h1)
