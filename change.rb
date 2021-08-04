require "pry-byebug"

binding.pry

def makeChange(n)
  if (n === 0)
    return {
      "quarter" => 0,
      "dime" => 0,
      "nickel" => 0,
      "penny" => 0,
    }
  end
  if (n >= 25)
    partial = makeChange(n - 25)
    partial["quarter"] += 1
    return partial
  end
  if (n >= 10)
    partial = makeChange(n - 10)
    partial["dime"] += 1
    return partial
  end
  if (n >= 5)
    partial = makeChange(n - 5)
    partial["nickel"] += 1
    return partial
  end
  partial = makeChange(n - 1)
  partial["penny"] += 1
  return partial
end

puts("Change Maker")
puts(makeChange(7));
puts(makeChange(86));
puts("DONE")

