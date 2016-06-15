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

from django.db import models
from django.utils.translation import ugettext_lazy as _
from taiga.projects.custom_attributes.models import TaskCustomAttributesValues



class TaskPoints(models.Model):
    task = models.ForeignKey("tasks.Task", null=False, blank=False,
                                related_name="task_points")

    estimated_points = models.FloatField(default=0.0, null=False, blank=True,
                                     verbose_name=_("estimated points"))
    real_points = models.FloatField(default=0.0, null=False, blank=True,
                                     verbose_name=_("real points"))
    task_type = models.TextField(blank=True, null=True,
                                      default='',
                                      verbose_name=_("task type"))

class TaskPointsSettings(models.Model):
    project = models.ForeignKey("projects.Project", null=False, blank=False,
                                related_name="task_points_settings")
    active = models.BooleanField(default=False, null=False, blank=False,
                                     verbose_name=_("check plugin activation"))

    ep_name = models.TextField(blank=False, null=False,
                                      default='Estimated Points',
                                      verbose_name=_("estimated points name"))
    rp_name = models.TextField(blank=False, null=False,
                                      default='Real Points',
                                      verbose_name=_("real points name"))
    tt_name = models.TextField(blank=False, null=False,
                                      default='Type',
                                      verbose_name=_("task type name"))

    ep_index = models.IntegerField(null=True, blank=True,
                                            verbose_name=_("estimated points index"))
    rp_index = models.IntegerField(null=True, blank=True,
                                            verbose_name=_("real points index"))
    tt_index = models.IntegerField(null=True, blank=True,
                                            verbose_name=_("task type index"))


    def get_estimated_points(self, task):
        task_attributes  = TaskCustomAttributesValues.objects.get(task=task).attributes_values
        estimated_points = 0.0
        ep_index = str(self.ep_index)

        if ep_index in task_attributes and task_attributes[ep_index] != '':
            estimated_points    = float( task_attributes[ep_index] )

        return estimated_points


    def get_real_points(self, task):
        task_attributes  = TaskCustomAttributesValues.objects.get(task=task).attributes_values
        real_points      = 0.0
        rp_index = str(self.rp_index)

        if rp_index in task_attributes and task_attributes[rp_index] != '':
            real_points         = float( task_attributes[rp_index] )

        return real_points


    def get_task_type(self, task):
        task_attributes  = TaskCustomAttributesValues.objects.get(task=task).attributes_values
        task_type        = ''
        tt_index = str(self.tt_index)

        if tt_index in task_attributes:
            task_type           = task_attributes[tt_index]

        return task_type
