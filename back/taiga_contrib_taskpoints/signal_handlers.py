###
#  Taiga-contrib-taskpoints is a taiga plugin for manage taskpoints.
#
#  Copyright 2016 by Sopra Steria
#  Copyright 2016 by David Peris <david.peris92@gmail.com>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
###

from . import services
from .models import TaskPointsSettings
from taiga.projects.tasks.models import Task



def on_task_custom_field_update(sender, instance, **kwargs):

    task        = instance.task
    userstory   = task.user_story
    project     = task.project

    try:
        settings = TaskPointsSettings.objects.get(project=project)
    except TaskPointsSettings.DoesNotExist:
        return None

    if not settings.active:
        return None

    services.update_task_subject(task, settings)
    services.update_roles(task, settings)
    services.update_userstory_points(userstory, settings)
