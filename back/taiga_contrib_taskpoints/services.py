# Copyright (C) 2014-2016 Andrey Antukh <niwi@niwi.nz>
# Copyright (C) 2014-2016 Jesús Espino <jespinog@gmail.com>
#
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
from django.db.models import Max
from django.core.exceptions import ObjectDoesNotExist

from taiga.projects.custom_attributes.models import TaskCustomAttribute, TaskCustomAttributesValues
from taiga.projects.tasks.models import Task
from taiga.projects.userstories.models import RolePoints
from taiga.projects.models import Points
from taiga.users.models import Role
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

    estimated_points = settings.get_estimated_points(task)
    real_points      = settings.get_real_points(task)
    task_type        = settings.get_task_type(task)

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


def clear_task_subject(task):

    if len(task.subject.split('|')) > 1:
        task_subject = task.subject.split('|')[1]
    else:
        task_subject = task.subject

    task.subject = task_subject
    task.save(update_fields=['subject'])


def update_all_tasks_values(settings):
    try:
        tasks = Task.objects.filter(project=settings.project)
        for task in tasks:
            update_task_subject(task, settings)
            update_roles(task, settings)
            update_userstory_points(task.user_story, settings)

    except Task.DoesNotExist:
        pass


def clear_all_tasks_subject(settings):
    try:
        tasks = Task.objects.filter(project=settings.project)
        for task in tasks:
            clear_task_subject(task)

    except Task.DoesNotExist:
        pass


def update_roles(task, settings):

    task_type = settings.get_task_type(task)

    if task_type == None or task_type == '':
        task_type = 'Undefined'
    try:
        role = Role.objects.get(project=settings.project, name=task_type)
    except Role.DoesNotExist:
        order = 10 + Role.objects.filter(project=settings.project).aggregate(Max('order'))['order__max']
        Role.objects.create(
                name = task_type,
                order = order,
                project = settings.project,
                computable = True
        )


def update_userstory_points(userstory, settings):
    project = settings.project
    tasks = Task.objects.filter(user_story=userstory)
    points = {}

    for task in tasks:
        estimated_points = settings.get_estimated_points(task)

        task_type        = settings.get_task_type(task)
        if task_type == None or task_type == '':
            task_type = 'Undefined'

        try:
            role = Role.objects.get(name=task_type, project=project)
            if role.name in points:
                points[role.name] += estimated_points
            else:
                points[role.name] = estimated_points

        except ObjectDoesNotExist:
            pass

    for role_name in points.keys():
        try:
            points_obj = Points.objects.get(value=points[role_name], project=project)
        except Points.DoesNotExist:
            order      = 10 + Points.objects.filter(project=project).aggregate(Max('order'))['order__max']
            points_obj = Points.objects.create(name=str(points[role_name]), value=points[role_name], project=project)
        try:
            role            = Role.objects.get(name=role_name, project=project)
            role_points, c  = RolePoints.objects.get_or_create(user_story=userstory, role=role, defaults={'points': points_obj})

            role_points.points = points_obj
            role_points.save()

        except Role.DoesNotExist:
            pass
