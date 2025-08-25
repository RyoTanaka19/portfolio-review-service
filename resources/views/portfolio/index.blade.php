<!-- resources/views/portfolio/index.blade.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio</title>
</head>
<body>
    <h1>ポートフォリオ一覧</h1>

    <ul>
        @foreach ($portfolios as $portfolio)
            <li>{{ $portfolio->name }}</li> <!-- 例えば、Portfolioモデルにnameフィールドがある場合 -->
        @endforeach
    </ul>
</body>
</html>
