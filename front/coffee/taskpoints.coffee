###
# Copyright (C) 2014-2016 Andrey Antukh <niwi@niwi.nz>
# Copyright (C) 2014-2016 Jesús Espino Garcia <jespinog@gmail.com>
# Copyright (C) 2014-2016 David Barragán Merino <bameda@dbarragan.com>
# Copyright (C) 2014-2016 Alejandro Alonso <alejandro.alonso@kaleidos.net>
# Copyright (C) 2014-2016 Juan Francisco Alcántara <juanfran.alcantara@kaleidos.net>
# Copyright (C) 2014-2016 Xavi Julian <xavier.julian@kaleidos.net>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
# File: slack.coffee
###
debounce = (wait, func) ->
    return _.debounce(func, wait, {leading: true, trailing: false})


class TaskPointsAdmin
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
        @scope.sectionName = "Task points" # i18n
        @scope.sectionSlug = "task points"

        @scope.$on "project:loaded", =>
            promise = @repo.queryMany("taskpoints_settings", {project: @scope.projectId})

            promise.then (task_points_settings) =>
                @scope.settings = {
                    project: @scope.projectId,
                    active: false
                }

                if task_points_settings.length > 0
                    @scope.settings = task_points_settings[0]
                #title = "#{@scope.sectionName} - Plugins - #{@scope.project.name}" # i18n
                #description = @scope.project.description
            #@appMetaService.setAll(title, description)

    activate: (@http, @repo, @scope) ->
        @http.post(@repo.resolveUrlForModel(@scope.settings) + '/activate')

    deactivate: (@http, @repo, @scope) ->
        @http.post(@repo.resolveUrlForModel(@scope.settings) + '/deactivate')


TaskPointsDirective = ($repo, $confirm, $loading, $http, $urls) ->
    link = ($scope, $el, $attrs) ->
        form = $el.find("form").checksley({"onlyOneErrorElement": true})
        submit = debounce 2000, (event) =>
            event.preventDefault()

            return if not form.validate()

            currentLoading = $loading()
                .target(submitButton)
                .start()


            if not $scope.settings.id
                promise = $repo.create("taskpoints_settings", $scope.settings)
                promise.then (data) ->
                    $scope.settings = data
            else
                promise = $repo.save($scope.settings)
                promise.then (data) ->
                    $scope.settings = data

            promise.then (data)->
                if $scope.settings.active
                    TaskPointsAdmin.prototype.activate($http, $repo, $scope)
                else if $scope.settings.id
                    TaskPointsAdmin.prototype.deactivate($http, $repo, $scope)
                currentLoading.finish()
                $confirm.notify("success")

            promise.then null, (data) ->
                currentLoading.finish()
                form.setErrors(data)
                if data._error_message
                    $confirm.notify("error", data._error_message)

        submitButton = $el.find(".submit-button")

        $el.on "submit", "form", submit
        $el.on "click", ".submit-button", submit

    return {link:link}

module = angular.module('taigaContrib.taskpoints', ['taigaContrib.userstoryTable'])

module.controller("ContribTaskPointsAdminController", TaskPointsAdmin)
module.directive("contribTaskPoints", ["$tgRepo", "$tgConfirm", "$tgLoading", "$tgHttp", "$tgUrls", TaskPointsDirective])

initTaskPointsPlugin = ($tgUrls) ->
    $tgUrls.update({
        "taskpoints": "/taskpoints",
        "taskpoints_settings": "/taskpoints_settings"
    })
module.run(["$tgUrls", initTaskPointsPlugin])
