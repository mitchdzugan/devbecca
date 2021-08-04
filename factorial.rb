require "pry-byebug"

binding.pry

def factorial(n)
  if (n < 2)
    return 1
  end
  puts("Fact of " + n.to_s)
  factOneLess = factorial(n - 1)
  n * factOneLess
end

puts("RAW")
puts(4 * 3 * 2 * 1)
puts("From Function")
puts(factorial(4));
puts("DONE")

