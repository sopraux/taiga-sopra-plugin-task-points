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

from taiga.base import filters
from taiga.base import response
from taiga.base.api import ModelCrudViewSet
from taiga.base.decorators import detail_route, list_route

from . import models
from . import serializers
from . import permissions
from . import services


class TaskPointsSettingsViewSet(ModelCrudViewSet):
    model = models.TaskPointsSettings
    serializer_class = serializers.TaskPointsSettingsSerializer
    permission_classes = (permissions.TaskPointsSettingsPermission,)
    filter_backends = (filters.IsProjectAdminFilterBackend,)
    filter_fields = ("project",)

    @detail_route(methods=['POST'])
    def activate(self, request, pk=None):
        task_points_settings = self.get_object()

        self.check_permissions(request, 'activate', task_points_settings)

        services.create_custom_attributes_task_points(task_points_settings)
        #services.update_all_tasks(task_points_settings) # Se activa el signal handler on_task_custom_field_update

        return response.NoContent()


    @detail_route(methods=['POST'])
    def deactivate(self, request, pk=None):
        task_points_settings = self.get_object()

        self.check_permissions(request, 'deactivate', task_points_settings)

        #services.clear_all_tasks_subject(task_points_settings)

        return response.NoContent()
