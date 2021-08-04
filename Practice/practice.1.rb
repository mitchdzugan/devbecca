require "test/unit"

def reverse_string(s)
  # TODO write the body of this function
  return ""
end

def is_palindrome(s)
  # TODO write the body of this function
  return false
end

def merge_arrays(a1, a2)
  # TODO write the body of this function
  return []
end

class TestFunctions < Test::Unit::TestCase
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

  def test_reverse_string
    assert_equal("", reverse_string(""))
    assert_equal("Abc", reverse_string("cbA"))
  end

  def test_merge_arrays
    assert_equal([], merge_arrays([], []))
    assert_equal([1, -1, 2, -2, 3, -3], merge_arrays([1, 2, 3], [-1, -2, -3]))
    assert_equal([1, -1, -2, -3], merge_arrays([1], [-1, -2, -3]))
    assert_equal([1, -1, 2,  3], merge_arrays([1, 2, 3], [-1]))
  end
end
