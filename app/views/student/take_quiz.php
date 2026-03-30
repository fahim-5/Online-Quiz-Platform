<!doctype html>
<div class="container">
    <div class="card">
        <h2>Take Quiz</h2>
        <form id="takeQuizForm" method="post" action="/quiz/submit">
            <?php if (!empty($questions) && is_array($questions)): ?>
                <?php foreach ($questions as $i => $q): ?>
                    <div class="question" data-name="q<?= $i ?>">
                        <p><strong>Q<?= $i + 1 ?>.</strong> <?= htmlspecialchars($q['text']) ?></p>
                        <?php foreach ($q['options'] as $optIndex => $opt): ?>
                            <div>
                                <label>
                                    <input type="radio" name="q<?= $i ?>" value="<?= $optIndex ?>"> <?= htmlspecialchars($opt) ?>
                                </label>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="question" data-name="q0">
                    <p><strong>Q1.</strong> Sample question: Which is a server-side language?</p>
                    <div><label><input type="radio" name="q0" value="php"> PHP</label></div>
                    <div><label><input type="radio" name="q0" value="html"> HTML</label></div>
                    <div><label><input type="radio" name="q0" value="css"> CSS</label></div>
                </div>
            <?php endif; ?>
            <div style="margin-top:14px">
                <button type="submit" class="btn">Submit Answers</button>
            </div>
        </form>
    </div>
</div>
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/validation.js"></script>