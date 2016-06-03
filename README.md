Taiga contrib taskpoints
===================



The Taiga plugin for task points.


ACTIVATION WARNING!!!!
----------------------
If you are using the plugin in an existing project with user story points defined, you must add manually an "estimation points" custom attribute for tasks. Then you have to divide the user story points within that user story tasks (putting them inside the estimated points custom attribute). If you don't do that, when you activate the plugin it will reset all user story points to 0!!!


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
