# Copyright (C) 2014-2016 Andrey Antukh <niwi@niwi.nz>
# Copyright (C) 2014-2016 Jesús Espino <jespinog@gmail.com>
# Copyright (C) 2014-2016 David Barragán <bameda@dbarragan.com>
# Copyright (C) 2014-2016 Alejandro Alonso <alejandro.alonso@kaleidos.net>
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

from django.utils import timezone

from taiga.projects.custom_attributes.models import TaskCustomAttribute, TaskCustomAttributesValues
from taiga.projects.tasks.models import Task
from .models import TaskPoints, TaskPointsSettings

import datetime


def get_custom_attributes_index(settings):
    index = {}

    ESTIMATED_POINTS = settings.ep_name
    REAL_POINTS = settings.rp_name
    TASK_TYPE = settings.tt_name

    try:
        custom_attributes = TaskCustomAttribute.objects.filter(project=settings.project)

        for attribute in custom_attributes:
            if attribute.name == ESTIMATED_POINTS:
                index[ESTIMATED_POINTS] = attribute.pk
            elif attribute.name == REAL_POINTS:
                index[REAL_POINTS] = attribute.pk
            elif attribute.name == TASK_TYPE:
                index[TASK_TYPE] = attribute.pk

    except TaskCustomAttribute.DoesNotExist:
        return None

    return index


def create_custom_attributes_task_points(settings):
    has_ep = False
    has_rp = False
    has_tt = False

    ESTIMATED_POINTS = settings.ep_name
    REAL_POINTS = settings.rp_name
    TASK_TYPE = settings.tt_name

    project = settings.project

    custom_attributes = TaskCustomAttribute.objects.filter(project=project)

    for attribute in custom_attributes:
        if attribute.name == ESTIMATED_POINTS:
            has_ep = True
        elif attribute.name == REAL_POINTS:
            has_rp = True
        elif attribute.name == TASK_TYPE:
            has_tt = True

    if not has_ep:
        TaskCustomAttribute.objects.create(project=project, name=ESTIMATED_POINTS)
    if not has_rp:
        TaskCustomAttribute.objects.create(project=project, name=REAL_POINTS)
    if not has_tt:
        TaskCustomAttribute.objects.create(project=project, name=TASK_TYPE)

    index = get_custom_attributes_index(settings)

    settings.ep_index = index[ESTIMATED_POINTS]
    settings.rp_index = index[REAL_POINTS]
    settings.tt_index = index[TASK_TYPE]

    settings.save()


def update_task_subject(task, settings):

    task_attributes_values = TaskCustomAttributesValues.objects.get(task=task).attributes_values
    #import pdb; pdb.set_trace()
    estimated_points = None
    real_points      = None
    task_type        = None
    ep_index = str(settings.ep_index)
    rp_index = str(settings.rp_index)
    tt_index = str(settings.tt_index)


    if ep_index in task_attributes_values and task_attributes_values[ep_index] != '':
        estimated_points    = float( task_attributes_values[ep_index] )
    if rp_index in task_attributes_values and task_attributes_values[rp_index] != '':
        real_points         = float( task_attributes_values[rp_index] )
    if tt_index in task_attributes_values:
        task_type           = task_attributes_values[tt_index]

    if len(task.subject.split('|')) > 1:
        task_subject = task.subject.split('|')[1]
    else:
        task_subject = task.subject

    subject = ''

    if estimated_points != None and estimated_points > 0:
        subject += '(' + str(estimated_points) + ') '
    if real_points != None and real_points > 0:
        subject += '[' + str(real_points) + '] '
    if task_type != None and task_type != '':
        subject += task_type
    if estimated_points != None or real_points != None or task_type != None:
        subject += ' | '


    task.subject = subject + task_subject   #Adds the custom attributes to the task subject (title)

    task.save(update_fields=['subject'])


def update_all_tasks_values(settings):
    try:
        tasks = Task.objects.filter(project=settings.project)
        for task in tasks:
            update_task_subject(task, settings)

    except Task.DoesNotExist:
        pass
