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
debounce = (wait, func) ->
    return _.debounce(func, wait, {leading: true, trailing: false})


class TaskBurndownAdmin
    @.$inject = [
        "$rootScope",
        "$scope",
        "$tgRepo",
        "tgAppMetaService",
        "$tgConfirm",
        "$tgHttp",
        "$tgUrls"
    ]

    constructor: (@rootScope, @scope, @repo, @appMetaService, @confirm, @http) ->
        @scope.sectionName = "Task burndown" # i18n
        @scope.sectionSlug = "task burndown"

        @scope.$on "project:loaded", =>
            TableAdmin = UserstoryTableAdmin.prototype
            promise = @repo.queryMany("milestones", {project: @scope.projectId})

            promise.then (project_milestones) =>
                @scope.milestones = project_milestones

                @scope.selected = TableAdmin.get_present_milestone project_milestones






TaskBurndownDirective = ($repo, $confirm, $loading, $http, $urls) ->
    link = ($scope, $el, $attrs) ->
        form = $el.find("form").checksley({"onlyOneErrorElement": true})
        submit = debounce 2000, (event) =>
            event.preventDefault()

            return if not form.validate()

            currentLoading = $loading()
                .target(submitButton)
                .start()

            $scope.settings.active = !$scope.settings.active

            if not $scope.settings.id
                promise = $repo.create("taskpoints_settings", $scope.settings)
                promise.then (data) ->
                    $scope.settings = data
            else
                promise = $repo.save($scope.settings)
                promise.then (data) ->
                    $scope.settings = data


                currentLoading.finish()
                $confirm.notify("success")

            promise.then null, (data) ->
                currentLoading.finish()
                form.setErrors(data)
                if data._error_message
                    $confirm.notify("error", data._error_message)

            $scope.settings.active

        submitButton = $el.find(".submit-button")

        $el.on "submit", "form", submit
        $el.on "click", ".submit-button", submit

    return {link:link}

module = angular.module('taigaContrib.taskBurndown', [])

module.controller("ContribTaskBurndownAdminController", TaskBurndownAdmin)
module.directive("contribTaskBurndown", ["$tgRepo", "$tgConfirm", "$tgLoading", "$tgHttp", "$tgUrls", TaskBurndownDirective])
