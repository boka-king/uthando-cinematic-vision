<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Display the supplied full logo lockup in the home opening and the compact emblem in navigation; keep the main logo visible without delayed blur so the brand is immediately recognizable.
- Render logos only through `src/components/site/Logo.tsx` (`LogoMark`, `LogoLockup`) so the inline fallback mark engages on load failure; its mount-time `complete && naturalWidth === 0` check is required because image errors can fire before React hydrates.
- Load optional hero depth dynamically after hydration only on visible, motion-enabled desktop dark views; keep the logo and copy in HTML so small screens and WebGL failures retain the complete opening.
