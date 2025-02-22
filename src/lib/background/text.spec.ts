import { describe, expect, test } from 'vitest'
import {formatResult} from "./text";

describe('text', () => {
  describe('formatResult', () => {
    test.each([
      ["test translation", "test original", "test translation"],
      ["-test -translation", "-test\n-original", "-test\n-translation"],
      ["test translation", "test\noriginal", "test\ntranslation"],
      ["test aaa bbb ccc ddd eee fff ggg hhh", "test one two\nthree four\nfive six", "test aaa bbb ccc\nddd eee fff\nggg hhh"],
      ["two\nwords", "test one two\nthree four\nfive six", "two\nwords"],

    ])('should format the result', (translation, original, expected) => {
      const result = formatResult(translation, original)
      expect(result).toBe(expected)
    })
  })
})
