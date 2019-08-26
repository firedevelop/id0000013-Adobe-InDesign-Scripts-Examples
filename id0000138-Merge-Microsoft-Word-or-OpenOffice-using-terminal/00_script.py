#!/usr/local/bin/python3
import xml.dom.minidom 
import sys 
import re 
import codecs
import os
import fnmatch
import subprocess
from shutil import copyfile
from zipfile import ZipFile
import mmap

DEBUG = 1

def dprint(what):
   if DEBUG == 0: return
   sys.stderr.write("%"+str(what.encode('ascii', 'replace'))+"\n")

def pretty(aNode, depth):
    dprint("  "*depth + aNode.nodeName + " " + str(aNode.nodeValue))
    if aNode.hasChildNodes():
        for kid in list(aNode.childNodes):
            r = pretty(kid, depth+1)
            if (r == "CUT"):
                if kid.nodeName == "text:p" or kid.nodeName == "text:h":
                    dprint("                        Remove")
                aNode.removeChild(kid)
                return r
            if kid.nodeName == "text:p" or kid.nodeName == "text:h":
                dprint("                        Remove")
                aNode.removeChild(kid)
    elif 'data' in dir(aNode):
        if "@end@" in aNode.data:
            return "CUT"


def doit(argv):
   doc = xml.dom.minidom.parse(argv)
   node = doc.getElementsByTagName('office:text')
   dprint("NODE["+ str(node)+"]")
   for ot in node:
       pretty(ot,0)
   sys.stdout.write(doc.toxml('utf-8').decode())

def busca(file):
    f = open(file)
    s = mmap.mmap(f.fileno(), 0, access=mmap.ACCESS_READ)
    if s.find(b'@end@') != -1:
        return True
    else: 
        return False

if __name__ == "__main__":
    if len(sys.argv) != 3:
        dprint("Uso: \n cleaner dir1 dir2")
    elif not os.path.isdir(sys.argv[1]):
        dprint(sys.argv[1]+" no es directorio. Error")
    else:
        if not os.path.isdir(sys.argv[2]):
            os.mkdir(sys.argv[2])
        dprint("STST")
        for FILE in fnmatch.filter(os.listdir(sys.argv[1]), "*.odt"):
            dprint(" " + FILE)
            ffpath=sys.argv[1]+"/"+FILE
            tmpc="/tmp/cnt.xml"
            content="/tmp/content.xml"
            with ZipFile(ffpath, 'r') as zipRef:
                zipRef.extract("content.xml", "/tmp")
#                if subprocess.run(['grep', '-q', '@end@', content]):
                if busca(content):
                    os.rename(content, tmpc)
                    sys.stdout = open(content, 'w')
                    doit(tmpc)
                    sys.stdout = sys.__stdout__
                    copyfile(ffpath, "/tmp/"+FILE)
                    subprocess.run(['zip', '-r', FILE, 'content.xml' ], cwd='/tmp')
                    copyfile("/tmp/"+FILE, sys.argv[2]+"/"+FILE)
                else:
                    dprint("@end@ not found")
