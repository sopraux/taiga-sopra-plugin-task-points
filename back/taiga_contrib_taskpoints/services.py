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

from projects.custom_attributes.models import TaskCustomAttribute, TaskCustomAttributesValues
from .models import TaskPoints, TaskPointsSettings

import datetime


def get_custom_attributes_index(project):
    index = {}
    try:
        settings = TaskPointsSettings.objects.get(project=project)
        ESTIMATED_POINTS = settings.ep_name
        REAL_POINTS = settings.rp_name
        TASK_TYPE = settings.tt_name
    except:
        ESTIMATED_POINTS = TaskPointsSettings._meta.get_field_by_name('ep_name').default
        REAL_POINTS = TaskPointsSettings._meta.get_field_by_name('rp_name').default
        TASK_TYPE = TaskPointsSettings._meta.get_field_by_name('tt_name').default

    try:
        custom_attributes = TaskCustomAttribute.objects.get(project=project)

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

    custom_attributes = TaskCustomAttribute.objects.get(project=project)

    for attribute in custom_attributes
        if attribute.name == ESTIMATED_POINTS:
            has_ep = True
        elif attribute.name == REAL_POINTS:
            has_rp = True
        elif attribute.name == TASK_TYPE:
            has_tt = True

    if not has_ep:
        TaskCustomAttribute.create(project=project, name=ESTIMATED_POINTS)
    if not has_rp:
        TaskCustomAttribute.create(project=project, name=REAL_POINTS)
    if not has_tt:
        TaskCustomAttribute.create(project=project, name=TASK_TYPE)


def update_task_subject(task, settings, save):

    task_attributes_values = TaskCustomAttributesValues.objects.get(task=task).attributes_values

    estimated_points    = task_attributes_values[settings.ep_index]
    real_points         = task_attributes_values[settings.rp_index]
    task_type           = task_attributes_values[settings.tt_index]

    if len(task.subject.split('.')) > 0:
        task_subject = task.subject.split('.')[1]
    else
        task_subject = task.subject

    subject = ''

    if estimated_points != None && estimated_points > 0:
        subject += '(' + estimated_points + ') '
    if real_points != None && real_points > 0:
        subject += '[' + real_points + '] '
    if task_type != None && task_type != '':
        subject += task_type + '. '

    task.subject = subject + task_subject   #Adds the custom attributes to the task subject (title)
    if save:
        task.save()


def update_all_tasks_values(settings):
    try:
        tasks = Task.objects.get(project=settings.project)
        for task in tasks:
            update_task_subject(task, settings, True)

    except Task.DoesNotExist:
        pass
