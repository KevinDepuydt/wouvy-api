import { connect, dropDatabase } from '../src/config/lib/db';
import User from '../src/models/user';
import Workflow from '../src/models/workflow';
import Task from '../src/models/task';
import Document from '../src/models/document';
import Poll from '../src/models/poll';
import NewsFeedItem from '../src/models/news-feed-item';

const user = new User({ email: 'test@mail.com', firstname: 'Jean', lastname: 'Fixtures', password: 'password' });

const NB_WORKFLOW = 10;
const NB_TASKS = 50;
const NB_POLLS = 50;
const NB_DOCS = 50;
const NB_MEMBERS = 10;

connect(() => {
  console.log('DB Connected');
  // First drop db
  dropDatabase();
  console.log('DB Dropped');

  // Create a user first
  user.save().then(() => {
    console.log('User saved');

    for (let i = 1; i <= NB_WORKFLOW; i += 1) {
      const workflow = new Workflow({ user, name: `Workflow ${i}`, users: [user], roles: [{ user, role: { level: 2, label: 'admin' } }] });
      workflow.save().then(() => {
        console.log(`Workflow ${i} saved`);
        // Tasks
        for (let j = 1; j <= NB_TASKS; j += 1) {
          const task = new Task({ workflow, user, name: `Task ${j}` });
          task.save()
            .then(() => {
              console.log(`Workflow ${i} Task ${j} saved`);
              const item = new NewsFeedItem({ user, workflow, type: 'task', data: { task } });
              item.save()
                .then(() => console.log(`Workflow ${i} Task ${j} news feed item saved`))
                .catch(error => console.log(`Workflow ${i} Task ${j} failed to save news feed item`, error));
            })
            .catch(error => console.log(`Workflow ${i} Task ${j} failed to save`, error));
        }

        // Documents
        for (let k = 1; k <= NB_DOCS; k += 1) {
          const doc = new Document({ workflow, user, name: `Document ${k}`, file: 'https://fournews-assets-prod-s3b-ew1-aws-c4-pml.s3.amazonaws.com/media/2017/12/snow_london_g_hd.jpg' });
          doc.save()
            .then(() => {
              console.log(`Workflow ${i} Document ${k} saved`);
              const item = new NewsFeedItem({ user, workflow, type: 'document', data: { document: doc } });
              item.save()
                .then(() => console.log(`Workflow ${i} Document ${k} news feed item saved`))
                .catch(error => console.log(`Workflow ${i} Document ${k} failed to save news feed item`, error));
            })
            .catch(error => console.log(`Workflow ${i} Document ${k} failed to save`, error));
        }

        // Polls
        for (let l = 1; l <= NB_POLLS; l += 1) {
          const poll = new Poll({ workflow, user, topic: `Poll ${l}`, choices: [{ text: 'Choice 1', users: [] }, { text: 'Choice 2', users: [] }] });
          poll.save()
            .then(() => {
              console.log(`Workflow ${i} Poll ${l} saved`);
              const item = new NewsFeedItem({ user, workflow, type: 'poll', data: { poll } });
              item.save()
                .then(() => console.log(`Workflow ${i} Document ${l} news feed item saved`))
                .catch(error => console.log(`Workflow ${i} Document ${l} failed to save news feed item`, error));
            })
            .catch(error => console.log(`Workflow ${i} Poll ${l} failed to save`, error));
        }

        // Members
        for (let m = 1; m <= NB_MEMBERS; m += 1) {
          const member = new User({ email: `wf-${i}-member-${m}@mail.com`, firstname: `[WF${i}] Jean ${m}`, lastname: 'Fixtures', password: 'password' });
          const role = { user: member, role: { level: 0, label: 'member' } };
          member.save()
            .then(() => {
              console.log(`Workflow ${i} User ${m} saved`);
              workflow.users.push(member);
              workflow.roles.push(role);
              workflow.save().then(() => console.log(`User ${m} and Role added to workflow ${i}`));
            })
            .catch(error => console.log(`Workflow ${i} User ${m} failed to save`, error));
        }
      });
    }
  });
});
