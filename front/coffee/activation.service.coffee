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

serviceProvider = ($repo, $http) ->
    service = {}

    service.activate = (settings) ->
        $http.post($repo.resolveUrlForModel(settings) + '/activate')

    service.deactivate = (settings) ->
        $http.post($repo.resolveUrlForModel(settings) + '/deactivate')

    return service


module = angular.module("taigaContrib.services", [])
module.factory("activationService", ["$tgRepo", "$tgHttp", serviceProvider])
