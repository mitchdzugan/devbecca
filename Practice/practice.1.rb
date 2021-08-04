# by default ruby will only have access to the functions in the current file + a small
# set of builtins. the `require` keyword allows us to add code that has been written
# elsewhere so we can use it in our file. In this case we are pulling in the standard
# ruby testing code which comes installed with all versions of ruby. More on that below.
require "test/unit"

def reverse_string(s)
  # TODO write the body of this function without using s.reverse
  return ""
end

def is_palindrome(s)
  # TODO write the body of this function
  return ""
end

def merge_arrays(a1, a2)
  # TODO write the body of this function
  # combine the 2 arrays in a zipper pattern
  #  - first element of a1
  #  - first element of a2
  #  - second element of a1
  #  - ...
  # its ok if one array is longer, the result will just have the same
  # tail as the longer array. See the tests for expected behavior.
  return []
end

def is_letter(s)
  # returns true if the string is a letter, false if it is any other character (see the tests
  # for expected behavior)
  # This will be needed to get the impossible palindrome test to pass and ruby doesn't have a good
  # builtin for it surprisingly so figured I'd give it to you. There's undoubtedly other ways to do
  # this but this is a nice simple implementation. the `swapcase` function on a string turns all
  # lower case characters into upper case and vice versa, other characters remain untouched. So
  # we know that the input is a letter if the result of `swapcase` is different (that's the `!=`)
  # then what we started with.
  return s.swapcase != s
end

=begin (this is how you do multiline comments without having to start each line with # btw)
This is how the tests get registered to run when this file is executed. This line may look crazy but
its not doing much really, we will get to it all in time.
For now if you want to understand a bit more what this is doing it is defining a new class called
`TestFunctions` that will be a subclass of the class `Test::Unit::TestCase` (Ill get to the colons
in a bit). For now you can just know that classes are used to group functions together to be reused,
in this case the behavior we want to reuse is the act of registering all of the subsequent functions
as tests, running them when this file is executed, and keeping track of the stats. You can see how
these behaviors are defined in the actual ruby source code here:
https://github.com/ruby/ruby/blob/d92f09a5eea009fa28cd046e9d0eb698e3d94c5c/tool/lib/test/unit/testcase.rb#L9
(which you can see itself is just a subclass of this class below where the behavior is defined)
https://github.com/ruby/ruby/blob/master/tool/lib/minitest/unit.rb#L1290
(btw I barely understand the code above, but the more you look behind the scenes the more you start to get it)

as for the colons, those denote "modules" which are nothing more than organizational tools. You introduce a
module definition and then all of the definitions inside of it need to be prefaced with the module name.
Useful for keeping your functions organized and so that other people can find them. ie:

module A
  Greeting = "Hello"
  module B
    Person = "Reb"
  end
end
puts(A::Greeting + " " + A::B::Person) # Prints "Hello Reb"

=end
class TestFunctions < Test::Unit::TestCase
  def test_reverse_string
    assert_equal("", reverse_string(""))
    assert_equal("Abc", reverse_string("cbA"))
  end

  def test_is_palindrome
    assert_equal(true, is_palindrome("racecar"))
    assert_equal(true, is_palindrome("abba"))
    assert_equal(true, is_palindrome("a"))
    assert_equal(true, is_palindrome(""))
    assert_equal(false, is_palindrome("dog"))
  end

  def test_is_palindrome_hard
    assert_equal(true, is_palindrome("Racecar"))
  end

  def test_is_palindrome_IMPOSSIBLE
    assert_equal(true, is_palindrome("Do geese see God?"))
  end

  def test_merge_arrays
    assert_equal([], merge_arrays([], []))
    assert_equal([1, -1, 2, -2, 3, -3], merge_arrays([1, 2, 3], [-1, -2, -3]))
    assert_equal([1, -1, -2, -3], merge_arrays([1], [-1, -2, -3]))
    assert_equal([1, -1, 2,  3], merge_arrays([1, 2, 3], [-1]))
  end

  def test_is_letter
    asssert_equal(false, is_letter("?"))
    asssert_equal(false, is_letter(" "))
    asssert_equal(true, is_letter("a"))
    asssert_equal(true, is_letter("B"))
  end
end
