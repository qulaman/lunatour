# Публикация сайта: GitHub → Cloudflare Pages

- Репозиторий: https://github.com/qulaman/lunatour
- Домен: https://lunatour.kz (казахская версия: https://lunatour.kz/?lang=kk), куплен на Hoster.kz, NS-серверы переведены на Cloudflare
- Технический адрес: https://lunatour.wsupkz.workers.dev
- Каждый `git push` в `main` автоматически обновляет сайт через 1–2 минуты.

## 1. Репозиторий на GitHub

1. Зайдите на github.com → «New repository». Имя, например, `luna-tour-china`. Оставьте репозиторий пустым: без README, без .gitignore.
2. В папке проекта выполните (подставьте свой адрес репозитория):

```powershell
cd Z:\LunaTour
git remote add origin https://github.com/ВАШ_ЛОГИН/luna-tour-china.git
git push -u origin main
```

При первом пуше Git попросит войти в GitHub — откроется окно браузера.

## 2. Cloudflare Pages

1. Зарегистрируйтесь на dash.cloudflare.com (бесплатно).
2. Слева: **Workers & Pages → Create → Pages → Connect to Git**.
3. Разрешите доступ к GitHub и выберите репозиторий `luna-tour-china`.
4. Настройки сборки:
   - Framework preset: **None**
   - Build command: оставить пустым
   - Build output directory: `/` (корень)
5. Нажмите **Save and Deploy**. Через минуту сайт будет доступен по адресу вида `https://luna-tour-china.pages.dev`.

Дальше каждый `git push` в ветку `main` автоматически обновляет сайт.

## 3. Свой домен

**Custom domains → Set up a custom domain** в настройках проекта Pages.

- Домен, купленный у любого регистратора: в панели регистратора замените NS-серверы на те, что покажет Cloudflare (два адреса вида `xxx.ns.cloudflare.com`). Через несколько часов домен заработает, SSL выпустится сам.
- Домен из Cloudflare Registrar: подключается автоматически, ничего менять не нужно.

Русская версия открывается по адресу домена, казахская — по `https://домен/?lang=kk`.

## 4. Обновление сайта

```powershell
cd Z:\LunaTour
git add -A
git commit -m "Что изменили"
git push
```
