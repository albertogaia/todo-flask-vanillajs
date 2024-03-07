from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

tasks = [
    {"id": 1, "task": "Comprare il latte", "completed": False},
    {"id": 2, "task": "Leggere un libro", "completed": True},
]

last_task_id = len(tasks)

@app.route('/tasks', methods=['GET', 'POST'])
def manage_tasks():
    if request.method == 'GET':
        return jsonify(tasks)
    elif request.method == 'POST':
        global last_task_id
        task = request.json
        last_task_id += 1  # Incrementa l'ID per ogni nuova task
        task['id'] = last_task_id  # Assegna l'ID alla nuova task
        tasks.append(task)
        return jsonify(task), 201

@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    global tasks
    tasks = [task for task in tasks if task['id'] != task_id]
    return jsonify({'result': True})


@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json
    for task in tasks:
        if task['id'] == task_id:
            task['completed'] = data.get('completed', task['completed'])
            return jsonify(task)
    return jsonify({'message': 'Task non trovata'}), 404


if __name__ == '__main__':
    app.run(debug=True)
