***** LICENSE ****
  This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.



***** DESCRIPTION SCRIPT *****
This script find the error page numbers in a Index. The script will output the numbers with a range bigger than specify for you in the variable RANGE_LIMIT.

Example: error output if you have config your RANGE_LIMIT =7, and the script find the next range:

Human 10, 50-60

The error is because the range of 50-60 is 10, and you said the RANGE_LIMIT=7



***** INSTRUCTIONS TO USE *****
1. install python 3.
NOTICE: you need run the python version 3, because is not working properly with python 2.


2. check in terminal if you have the version python 3, with this:
python3 -V

The output will be something like this:
Python 3.7.0


3. Run the script in terminal:
python3 index.py index.txt

Notice, also you can run multiples files, type this in terminal:
 python3 index.py index1.txt index2.txt index3.txt


4. you will get the number line errors, similar like this:
Error on line  2
Error on line  3
Error on line  5
Error on line  15
Error on line  38
Error on line  159
Error on line  160
Error on line  161
Error on line  162
Error on line  163
Error on line  221
Error on line  239


5. Enjoy! 