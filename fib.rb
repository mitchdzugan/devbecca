require "pry-byebug"

binding.pry

def fib(n)
  if (n < 2)
    return 1
  end
  n1 = fib(n - 1)
  n2 = fib(n - 2)
  return n1 + n2
end

puts("RAW")
puts(fib(4))
puts(fib(7))
puts("DONE")

