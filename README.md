# Desktop client pour projet transmédia Hydromerta

Les instructions pour installer l'app sur votre pc sont juste en dessous. Enjoy

## Install backend
Vous devez avoir une instance de mongo qui tourne sur votre machine pour faire
tourner correctement le backend. Sans elle il ne sera pas possible de se connecter
a l'application par la suite.

#### Clone backend
Le backend se trouve sur ce repos :
https://github.com/transmedia41/api-dev-connection-pof

    git clone git@github.com:transmedia41/api-dev-connection-pof.git

#### Install packages
Une fois le repos cloner aller dans celui ci et lancer la commande `npm install` pour
installer les composant node (un dossier node_modules doit apparaitre)

#### Start server
Pour lancer le serveur fait la commande `node index.js` (il faut que le bin de node soit dans le path)

#### Populate database
Il n'est pas necéssaire de faire cette étape mais si vous la faite vous verez 
des données dans la console lorsque vous irez sur l'app desktop
Dans votre client REST préféré tapper :

    POST http://localhost:3000/api/v1/data/populate
    
Ce qui va remplire la base avec les infos contenues dans les fichiers JSON. Il faut maintenant créé un
utilisateur qui vous sera utile pour vous connecter par la suite.

    POST http://localhost:3000/register
    
    payload JSON:
    {
      "username": "Joel",
      "password": "admin"
    }
    
Le backend est maintenant pret à recevoir le login de cet utilisateur.

## Install frontend
Pour installer le frontend c'est a peut pret la meme chose... le repos ben vous y êtes les cocos.

#### Clone frontend

    git clone git@github.com:transmedia41/hydromerta-desktop.git

#### Install packages
Pour installer les dépendance il faut cette fois lancer deux commandes, vous pouvez les faire l'une après
l'autre ou les deux en meme temps comme ça `npm install && bower install`

#### Start server in localmod
Une fois les dépendance installer (dans les dossier node_modules et bower_components) on peut lancer
un server qui nous délivrera le front avec `grunt serve`

Il ne vous reste plus qu'a profiter de l'état actuel de l'app... a ces début mais ca rend bien je trouve

#### Create version to dist
Run `grunt` and copy `/dist`


## Yeoman generator
 * https://github.com/yeoman/generator-angular
 * https://angularjs.org/
