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

UserstoryTableDirective = ($repo, $confirm, $loading, $urls, table_service, chart_service) ->
    link = ($scope, $el, $attrs) ->
        $scope.changeSprint = () =>

            if $scope.selected?
                table_service.get_table($scope)

                chart_service.get_settings($scope.projectId)
                .then (settings) =>
                    chart_service.startDraw(burndown, $scope.selected, settings) if settings.active


        select = $el.find(".select-sprint")

        burndown = $el.find('.task-burndown')

    return {link:link}


UserstoryTableDirective.$inject = [
    "$tgRepo",
    "$tgConfirm",
    "$tgLoading",
    "$tgUrls",
    "tableService",
    "chartService"
]


module.directive("contribUserstoryTable", UserstoryTableDirective)

initUserstoryTablePlugin = ($tgUrls) ->
    $tgUrls.update({
        "userstory_table": "/userstory_table"
    })
module.run(["$tgUrls", initUserstoryTablePlugin])
