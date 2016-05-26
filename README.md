Taiga contrib bank taskpoints
===================

![Kaleidos Project](http://kaleidos.net/static/img/badge.png "Kaleidos Project")
[![Managed with Taiga.io](https://taiga.io/media/support/attachments/article-22/banner-gh.png)](https://taiga.io "Managed with Taiga.io")

The Taiga plugin for bank taskpoints.


Installation
------------
### Production env

#### Taiga Back

In your Taiga back python virtualenv install the pip package `taiga-contrib-taskpoints` with:

```bash
  pip install ../taiga-contrib-taskpoints/back
```

Modify in `taiga-back` your `settings/local.py` and include the line:

```python
  INSTALLED_APPS += ["taiga_contrib_taskpoints"]
```

Then run the migrations to generate the new need table:

```bash
  python manage.py makemigrations taiga_contrib_taskpoints
  python manage.py migrate taiga_contrib_taskpoints
```

#### Taiga Front

Download in your `dist/plugins/` directory of Taiga front the `taiga-contrib-taskpoints` compiled code (you need subversion in your system):

```bash
  cd taiga-front-dist/dist
  mkdir -p plugins
  cd plugins
  cp -r ../../../taiga-contrib-taskpoints/front/dist taskpoints
```

Include in your `dist/conf.json` in the `contribPlugins` list the value `"/plugins/taskpoints/taskpoints.json"`:

```json
...
    "contribPlugins": [
        (...)
        "/plugins/taskpoints/taskpoints.json"
    ]
...
```

### Dev env

#### Taiga Back

Clone the repo and

```bash
  cd taiga-back
  virtualenv env
  source env/bin/activate
  pip install -e ../taiga-contrib-taskpoints/back
```

Modify in `taiga-back` your `settings/local.py` and include the line:

```python
  INSTALLED_APPS += ["taiga_contrib_taskpoints"]
```

Then run the migrations to generate the new need table:

```bash
  python manage.py makemigrations taiga_contrib_taskpoints
  python manage.py migrate taiga_contrib_taskpoints
```

#### Taiga Front

After clone the repo link `dist` in `taiga-front` plugins directory:

```bash
  cd taiga-front/dist
  mkdir -p plugins
  cd plugins
  ln -s ../../../taiga-contrib-taskpoints/front/dist taskpoints
```

Include in your `dist/conf.json` in the `contribPlugins` list the value `"/plugins/taskpoints/taskpoints.json"`:

```json
...
    "contribPlugins": [
        (...)
        "/plugins/taskpoints/taskpoints.json"
    ]
...
```

In the plugin source dir `taiga-contrib-taskpoints/front` run

```bash
npm install
```
and use:

- `gulp` to regenerate the source and watch for changes.
- `gulp build` to only regenerate the source.
