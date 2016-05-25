#!/usr/bin/python

import sys, shutil, os

if len(sys.argv) < 2 | len(sys.argv) > 2:
    print('Usage: python patch-taiga-taskpoints.py <taiga_back_folder>')
else:
    path = sys.argv[1] + "/taiga/projects/"

    fich_to_replace = path + "milestones/api.py"
    fich_replacement = os.path.dirname(os.path.realpath(sys.argv[0])) + "/api.py"
    shutil.copy(fich_replacement, fich_to_replace)
