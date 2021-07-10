require "pry-byebug"

binding.pry

a = 1

def g(c)
  d = c + 1
  e = c + 2
  d + e
end

b = 2

f = g(a)

puts([a, b, f])
