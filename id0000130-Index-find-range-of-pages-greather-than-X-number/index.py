import re
import sys

RANGE_LIMIT = 7 # maximum page range limit, change this to what you want

# all possible unicode dashes
dashes = '\u002D|\u058A|\u05BE|\u1400|\u1806|\u2010|\u2011|\u2012|\u2013|\u2014|\u2015|\u2E17|\u2E1A|\u2E3A|\u2E3B|\u2E40|\u301C|\u3030|\u30A0|\uFE31|\uFE32|\uFE58|\uFE63|\uFF0D'

def find_errors(filename):
	try:
		with open(filename, 'r') as f:
			i = 1
			for line in f:
				matches = re.findall('\d+\s*(?:{0})\s*\d+'.format(dashes), line)
				for match in matches:
					match = re.split(dashes, match)
					n1 = int(match[0])
					n2 = int(match[1])
					if n2 - n1 > RANGE_LIMIT:
						print("Excessively large range on line ", i)

				i += 1

	except FileNotFoundError as e:
		print("No such file found.")


def main():
	fnames = sys.argv[1:]
	if not fnames:
		print("You need to specify the filename when calling the script.")
	else:
		for fname in fnames:
			print("Errors in file {0}:".format(fname))
			find_errors(sys.argv[1])
			print()

if __name__ == '__main__':
	main()