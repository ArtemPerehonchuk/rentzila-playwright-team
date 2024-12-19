if [ -z "$1" ]; then
  echo "Використання: ./run-tests.sh <all|file|keyword> [options]"
  echo "  all         - Запускає всі тести"
  echo "  <file>      - Запускає конкретний файл, наприклад test.login.spec.ts"
  echo "  <keyword>   - Запускає тести, що містять ключове слово, наприклад 'services'"
  echo "  [options]   - Додаткові параметри, наприклад '--workers=1' або '--project=chrome'"
  exit 1
fi

ARG=$1
OPTIONS="${@:2}"

if [ "$ARG" == "all" ]; then
  echo "Запуск всіх тестів із параметрами: $OPTIONS..."
  npx playwright test $OPTIONS

elif [[ "$ARG" == *.spec.ts ]]; then
  if [ -f "./tests/$ARG" ]; then
    echo "Запуск тесту $ARG із параметрами: $OPTIONS..."
    npx playwright test "tests/$ARG" $OPTIONS
  else
    echo "Помилка: файл tests/$ARG не знайдено."
    exit 1
  fi

else
  echo "Запуск тестів, що містять '$ARG' із параметрами: $OPTIONS..."
  npx playwright test --grep "$ARG" $OPTIONS
fi
