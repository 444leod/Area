<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/hey', function () {
    return 'Hello World';
});

Route::get('/mock-get', function (Request $request) {
    $param = $request->query('param');

    if ($param === 'success') {
        return response()->json(['message' => 'Requête réussie'], 200);
    } elseif ($param === 'error') {
        return response()->json(['error' => 'Erreur côté serveur'], 500);
    }

    return response()->json(['message' => 'Paramètre non spécifié'], 400);
});

Route::post('/mock-post', function (Request $request) {
    $data = $request->input('data');

    if ($data) {
        return response()->json(['message' => 'Données reçues'], 201);
    }

    return response()->json(['error' => 'Aucune donnée envoyée'], 422);
});


Route::delete('/mock-delete/{id}', function ($id) {
    if ($id) {
        return response()->json(['message' => "Ressource avec l'ID $id supprimée"], 200);
    }

    return response()->json(['error' => 'ID non fourni'], 400);
});