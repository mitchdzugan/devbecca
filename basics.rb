require "pry-byebug"

binding.pry

a = 1
b = 2

def g(c)
  d = c + 1
  e = c + 2
  d + e
end

f = g(a)

puts([a, b, f])
