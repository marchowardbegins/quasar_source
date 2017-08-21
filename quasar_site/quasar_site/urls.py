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
from django.conf.urls import url, include
from django.contrib import admin

# TODO : Temporary solution, make a permanent one eventually.
import sys
if '/home/git_repos/quasar_source' not in sys.path:
    sys.path.append('/home/git_repos/quasar_source')

from quasar_site.quasar_web_server import views as v

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^hello_world/$', v.GET_hello_world)
]
