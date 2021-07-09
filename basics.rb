require "pry-byebug"

def mything

  binding.pry

  a = 1
  b = 2

  puts([a, b])

end

mything()
