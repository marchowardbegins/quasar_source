"""quasar_site URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""

from django.conf.urls import url
from quasar_site_django.quasar_web_server import views as v

POST_URL_STATUS_PING           = r'ping'


urlpatterns = [
    url(POST_URL_STATUS_PING, v.GET_status_ping),
    url(r'dev'              , v.GET_quasar_dev),
    url(r''                 , v.GET_quasar_prod),
]
