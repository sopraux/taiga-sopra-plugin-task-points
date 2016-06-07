
serviceProvider = ($repo, $http) ->
    service = {}

    service.activate = (settings) ->
        $http.post($repo.resolveUrlForModel(settings) + '/activate')

    service.deactivate = (settings) ->
        $http.post($repo.resolveUrlForModel(settings) + '/deactivate')

    return service


module = angular.module("taigaContrib.services", [])
module.factory("activationService", ["$tgRepo", "$tgHttp", serviceProvider])
