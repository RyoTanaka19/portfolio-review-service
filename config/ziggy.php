<?php

return [
    /*
     * The location of the JavaScript file where Ziggy will be exposed.
     */
    'output' => public_path('js/ziggy.js'),

    /*
     * The path to the route list on your app. This should normally not need
     * changing unless your app's route list is located somewhere else.
     */
    'routes' => base_path('routes/web.php'),
];
