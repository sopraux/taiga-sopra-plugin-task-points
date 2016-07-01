#!/usr/bin/env python
# -*- coding: utf-8 -*-

import os
from setuptools import setup, find_packages

setup(
    name = 'taiga-contrib-taskpoints',
    version = ":versiontools:taiga_contrib_taskpoints:",
    description = "The Taiga plugin for task points",
    long_description = "",
    keywords = 'taiga, task, points, integration',
    author = 'David Peris Martinez',
    author_email = 'david.peris92@gmail.com',
    license = 'AGPLv3',
    include_package_data = True,
    packages = find_packages(),
    install_requires=[],
    setup_requires = [
        'versiontools >= 1.8',
    ],
    classifiers = [
        "Programming Language :: Python",
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: GNU Affero General Public License v3',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
        'Topic :: Internet :: WWW/HTTP',
        'Development Status :: 4 - Beta'
    ]
)
