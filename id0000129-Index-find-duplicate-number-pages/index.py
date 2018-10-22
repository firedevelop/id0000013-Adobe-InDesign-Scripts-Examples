import re
import sys

# all possible unicode dashes
dashes = '\u002D|\u058A|\u05BE|\u1400|\u1806|\u2010|\u2011|\u2012|\u2013|\u2014|\u2015|\u2E17|\u2E1A|\u2E3A|\u2E3B|\u2E40|\u301C|\u3030|\u30A0|\uFE31|\uFE32|\uFE58|\uFE63|\uFF0D'

def validate_nums(nums):
	seen = []
	for num in nums:
		if num in seen:
			return False
		seen.append(num)

	return True

def find_errors(filename):
	try:
		with open(filename, 'r') as f:
			i = 1
			for line in f:
				line = re.split('(\d+|{0})'.format(dashes), line)
				nums = []
				dash = False
				for s in line:
					if s.isdigit():
						n = int(s)
						if dash:
							nums.extend(range(nums[-1]+1, n+1))
							dash = False
						else:
							nums.append(n)
					elif re.match(dashes, s):
						dash = True

				if not (validate_nums(nums)):
					print("Error on line ", i)

				i += 1

	except FileNotFoundError as e:
		print("No such file found.")


def main():
	try:
		find_errors(sys.argv[1])
	except IndexError as e:
		print("You need to specify the filename when calling the script.")
	

if __name__ == '__main__':
	main()