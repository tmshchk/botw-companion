"""Display scope prose must translate without changing protocol scope values."""
import unittest

from botw_companion.i18n.presentation import Presenter


class ProfilePresentationTests(unittest.TestCase):
    def test_profile_scope_is_display_prose_but_other_scopes_are_preserved(self):
        source = 'Profil base ou DLC choisi depuis les preuves présentes dans la sauvegarde, limité aux validations automatiques.'
        presenter = Presenter('test', reference={
            'strings': {source: 'Translated profile description'},
            'glossary': {}, 'patterns': [], 'names_by_id': {},
        })
        profile = {'id': 'automatic', 'label': 'Automatic', 'scope': source,
                   'progress': {'total': 10}, 'metadata': {'scope': source}}
        result = presenter.present(profile)
        self.assertEqual(result['scope'], 'Translated profile description')
        self.assertEqual(result['metadata']['scope'], source)
        self.assertEqual(profile['scope'], source)
        self.assertEqual(presenter.present({'scope': 'base_game'}), {'scope': 'base_game'})


if __name__ == '__main__':
    unittest.main()
