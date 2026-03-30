<!doctype html>
<div class="container">
	<div class="card">
		<h2>Create Quiz</h2>
		<form id="createQuizForm" method="post" action="/admin/quizzes/create" class="validate-quiz">
			<div class="row">
				<div class="field">
					<label for="title">Quiz Title</label>
					<input type="text" name="title" id="title" placeholder="Enter quiz title" required>
				</div>
				<div class="field">
					<label for="time_limit">Time Limit (minutes)</label>
					<input type="number" name="time_limit" id="time_limit" min="1" placeholder="e.g., 30">
				</div>
			</div>
			<div class="row">
				<div class="field">
					<label for="description">Description</label>
					<textarea name="description" id="description" placeholder="Short description (optional)"></textarea>
				</div>
			</div>
			<div class="row">
				<div class="field">
					<label for="status">Status</label>
					<select name="status" id="status">
						<option value="draft">Draft</option>
						<option value="published">Published</option>
					</select>
				</div>
			</div>
			<div style="display:flex;gap:8px;margin-top:12px">
				<button type="submit" class="btn">Create Quiz</button>
				<a href="/admin/quizzes" class="btn secondary">Back to list</a>
			</div>
		</form>
		<p style="margin-top:14px;color:var(--muted);font-size:13px">Client-side validation included; server-side validation still required.</p>
	</div>
</div>
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/validation.js"></script>