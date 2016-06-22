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
module = angular.module('taigaContrib.taskpoints')

debounce = (wait, func) ->
    return _.debounce(func, wait, {leading: true, trailing: false})


class UserstoryTableAdmin
    @.$inject = [
        "$rootScope",
        "$scope",
        "$tgRepo",
        "tgAppMetaService",
        "$tgConfirm",
        "$tgHttp",
        "tableService",
        "chartService"
    ]

    constructor: (@rootScope, @scope, @repo, @appMetaService, @confirm, @http, @tableService, @chartService) ->
        @scope.sectionName = "User Stories table" # i18n
        @scope.sectionSlug = "user stories table"
        @scope.userstories = []
        @scope.roles = []

        @scope.$on "project:loaded", =>
            promise = @repo.queryMany("milestones", {project: @scope.projectId})

            promise.then (project_milestones) =>
                @scope.milestones = project_milestones

                @scope.selected = @tableService.get_present_milestone project_milestones

                @tableService.get_table(@scope)

                @chartService.get_settings(@scope.projectId)
                .then (settings) =>
                    burndown = $('.userstory-table .task-burndown')
                    @chartService.startDraw(burndown, @scope.selected, settings) if settings.active


module.controller("ContribUserstoryTableAdminController", UserstoryTableAdmin)
