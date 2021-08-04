require "pry-byebug"

# binding.pry

$MEM = {}
def fib(n)
  if (n < 2)
    return 1
  end
  if ($MEM[n])
    return $MEM[n]
  end
  n1 = fib(n - 1)
  n2 = fib(n - 2)
  ans = n1 + n2
  ### $MEM[n] = ans
  return ans
end

puts("RAW")
puts(fib(39))
puts("DONE")

